#!/usr/bin/env node
require('dotenv').config();
const neo4j = require('neo4j-driver');
const crypto = require('crypto');

const URI = process.env.NEO4J_URI || 'bolt://localhost:7687';
const USER = process.env.NEO4J_USERNAME || 'neo4j';
const PASSWORD = process.env.NEO4J_PASSWORD;

if (!PASSWORD) {
  console.error('NEO4J_PASSWORD is missing in environment');
  process.exit(1);
}

const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));

async function main() {
  const [,, username, villageSlug, title, contentType, contentUrl] = process.argv;

  if (!username || !villageSlug || !title || !contentType || !contentUrl) {
    console.error('Usage: node scripts/seed-piece.cjs <username> <villageSlug> "<title>" <contentType> "<contentUrl>"');
    console.error('Example: node scripts/seed-piece.cjs devid open-source-collab "Developer Knowledge Base" Documentation "https://example.com/dev-kb.txt"');
    process.exit(1);
  }

  const session = driver.session({ defaultAccessMode: neo4j.session.WRITE });

  try {
    const result = await session.executeWrite(async tx => {
      // 1. Verify User and Village exist
      let res = await tx.run(`MATCH (u:Mosaic_User {username: $username}) RETURN u.id AS userId`, { username });
      if (res.records.length === 0) throw new Error(`User with username '${username}' not found.`);
      const userId = res.records[0].get('userId');

      res = await tx.run(`MATCH (c:Mosaic_Community {slug: $villageSlug}) RETURN c.id AS communityId`, { villageSlug });
      if (res.records.length === 0) throw new Error(`Village with slug '${villageSlug}' not found.`);
      const communityId = res.records[0].get('communityId');

      // 2. Create a default Project to host this piece (pieces require a project in Mosaic)
      const projectId = crypto.randomUUID();
      const now = Date.now();
      await tx.run(`
        MATCH (owner:Mosaic_User {id: $userId})
        MATCH (community:Mosaic_Community {id: $communityId})
        MERGE (community)-[:HOSTS]->(project:Mosaic_Project {title: "Default Seed Project", communityId: $communityId})
        ON CREATE SET 
          project.id = $projectId, 
          project.ownerId = $userId, 
          project.description = "Auto-generated project for seeded pieces",
          project.status = 'ACTIVE',
          project.createdAt = $now
        MERGE (owner)-[:CONTRIBUTED_TO {role: 'OWNER'}]->(project)
        RETURN project.id AS finalProjectId
      `, { userId, communityId, projectId, now });

      res = await tx.run(`MATCH (c:Mosaic_Community {id: $communityId})-[:HOSTS]->(p:Mosaic_Project {title: "Default Seed Project"}) RETURN p.id AS finalProjectId LIMIT 1`, { communityId });
      const finalProjectId = res.records[0].get('finalProjectId');

      // 3. Create the Piece Node
      const pieceId = crypto.randomUUID();
      await tx.run(`
        MATCH (author:Mosaic_User {id: $userId})
        MATCH (project:Mosaic_Project {id: $projectId})
        CREATE (piece:Mosaic_Piece {
          id: $pieceId,
          projectId: $projectId,
          authorId: $userId,
          title: $title,
          contentUrl: $contentUrl,
          contentType: $contentType,
          createdAt: $now
        })
        MERGE (project)-[:CONTAINS]->(piece)
        MERGE (author)-[:AUTHORED {createdAt: $now}]->(piece)
      `, { userId, projectId: finalProjectId, pieceId, title, contentUrl, contentType, now });

      // 4. Create a Post in the Village feed with the piece embed link
      const postId = crypto.randomUUID();
      const postContent = `I just published a new piece: **${title}**.\n\nmosaic://piece/${pieceId}`;
      await tx.run(`
        MATCH (c:Mosaic_Community {id: $communityId})
        MATCH (u:Mosaic_User {id: $userId})
        CREATE (p:Mosaic_Post {
          id: $postId,
          communityId: $communityId,
          authorId: $userId,
          content: $postContent,
          score: 0,
          replyCount: 0,
          isPinned: false,
          createdAt: $now
        })
        CREATE (u)-[:AUTHORED]->(p)
        CREATE (p)-[:POSTED_IN]->(c)
      `, { communityId, userId, postId, postContent, now });

      return pieceId;
    });

    console.log(`\n✅ Successfully seeded piece!`);
    console.log(`Piece ID: ${result}`);
    console.log(`It should now appear in the feed for village '${villageSlug}'!`);

  } catch (err) {
    console.error('\n❌ Failed to seed piece:', err.message);
    process.exitCode = 1;
  } finally {
    await session.close();
    await driver.close();
  }
}

main();
