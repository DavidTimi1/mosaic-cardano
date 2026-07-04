#!/usr/bin/env node

require("dotenv").config();

const neo4j = require("neo4j-driver");
const crypto = require("crypto");
const fs = require("fs/promises");
const path = require("path");

const URI = process.env.NEO4J_URI || "bolt://localhost:7687";
const USER = process.env.NEO4J_USERNAME || "neo4j";
const PASSWORD = process.env.NEO4J_PASSWORD;

if (!PASSWORD) {
  console.error("NEO4J_PASSWORD is missing in environment");
  process.exit(1);
}

const driver = neo4j.driver(
  URI,
  neo4j.auth.basic(USER, PASSWORD)
);

async function getUserId(tx, username) {
  const res = await tx.run(
    `
    MATCH (u:Mosaic_User {username: $username})
    RETURN u.id AS userId
    `,
    { username }
  );

  if (res.records.length === 0) {
    throw new Error(`User '${username}' not found.`);
  }

  return res.records[0].get("userId");
}

async function getCommunityId(tx, villageSlug) {
  const res = await tx.run(
    `
    MATCH (c:Mosaic_Community {slug: $villageSlug})
    RETURN c.id AS communityId
    `,
    { villageSlug }
  );

  if (res.records.length === 0) {
    throw new Error(`Village '${villageSlug}' not found.`);
  }

  return res.records[0].get("communityId");
}

async function seedFile(tx, filePath, filename, userId, communityId) {
  const markdown = await fs.readFile(filePath, "utf8");

  const firstLine = markdown.split(/\r?\n/, 1)[0] ?? "";

  const title =
    firstLine.replace(/^#\s*/, "").trim() ||
    path.parse(filename).name;

  const pieceId = crypto.randomUUID();
  const postId = crypto.randomUUID();
  const now = Date.now();

  const contentUrl = `/resources/${filename}`;

  await tx.run(
    `
    MATCH (author:Mosaic_User {id: $userId})
    MATCH (community:Mosaic_Community {id: $communityId})

    CREATE (piece:Mosaic_Piece {
      id: $pieceId,
      communityId: $communityId,
      authorId: $userId,
      title: $title,
      contentUrl: $contentUrl,
      contentType: "Markdown",
      createdAt: $now
    })

    MERGE (community)-[:PUBLISHED_IN]->(piece)
    MERGE (author)-[:AUTHORED {createdAt: $now}]->(piece)
    `,
    {
      userId,
      communityId,
      pieceId,
      title,
      contentUrl,
      now,
    }
  );

  const postContent = `I just published a new piece: **${title}**.\n\nmosaic://piece/${pieceId}`;

  await tx.run(
    `
    MATCH (community:Mosaic_Community {id: $communityId})
    MATCH (author:Mosaic_User {id: $userId})

    CREATE (post:Mosaic_Post {
      id: $postId,
      communityId: $communityId,
      authorId: $userId,
      content: $postContent,
      score: 0,
      replyCount: 0,
      isPinned: false,
      createdAt: $now
    })

    CREATE (author)-[:AUTHORED]->(post)
    CREATE (post)-[:POSTED_IN]->(community)
    `,
    {
      communityId,
      userId,
      postId,
      postContent,
      now,
    }
  );

  console.log(`✓ ${title}`);
}

async function seedDirectory(
  tx,
  directory,
  userId,
  communityId
) {
  const entries = await fs.readdir(directory, {
    withFileTypes: true,
  });

  const files = entries.filter(
    (entry) =>
      entry.isFile() &&
      (entry.name.toLowerCase().endsWith(".txt") ||
        entry.name.toLowerCase().endsWith(".md"))
  );

  if (files.length === 0) {
    console.warn("No txt or md files found.");
    return 0;
  }

  let count = 0;

  for (const file of files) {
    await seedFile(
      tx,
      path.join(directory, file.name),
      file.name,
      userId,
      communityId
    );

    count++;
  }

  return count;
}

async function main() {
  const [, , username, villageSlug, directory] = process.argv;

  if (!username || !villageSlug || !directory) {
    console.error(
      "Usage: node scripts/seed-piece.cjs <username> <villageSlug> <directory>"
    );
    process.exit(1);
  }

  const absoluteDirectory = path.resolve(directory);

  try {
    const stat = await fs.stat(absoluteDirectory);

    if (!stat.isDirectory()) {
      throw new Error("Provided path is not a directory.");
    }
  } catch {
    console.error(`Directory not found: ${absoluteDirectory}`);
    process.exit(1);
  }

  const session = driver.session({
    defaultAccessMode: neo4j.session.WRITE,
  });

  try {
    const count = await session.executeWrite(async (tx) => {
      const userId = await getUserId(tx, username);
      const communityId = await getCommunityId(tx, villageSlug);

      return seedDirectory(
        tx,
        absoluteDirectory,
        userId,
        communityId
      );
    });

    console.log(`\n✅ Successfully seeded ${count} piece(s).`);
  } catch (err) {
    console.error("\n❌ Failed:", err.message);
    process.exitCode = 1;
  } finally {
    await session.close();
    await driver.close();
  }
}

main();