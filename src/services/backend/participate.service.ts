import { z } from 'zod';

import {
	CreateProjectRequestSchema,
	PublishArtifactRequestSchema,
	type CreateProjectRequest,
	type PublishArtifactRequest,
} from '@/types/api';
import { ArtifactNodeSchema, ProjectNodeSchema, type ArtifactNode, type ProjectNode } from '@/types/schemas';
import { cacheKey, invalidateCachePattern } from './cache';
import { runWrite } from './shared';

const ContributeInputSchema = z.object({
	userId: z.string().uuid(),
	projectId: z.string().uuid(),
	role: z.string().min(1).max(100),
});

export const participateService = {
	async createProject(input: CreateProjectRequest): Promise<ProjectNode> {
		const parsed = CreateProjectRequestSchema.parse(input);
		const now = Date.now();
		const projectId = crypto.randomUUID();

		const rows = await runWrite(
			`
				MATCH (owner:User {id: $ownerId})
				MATCH (community:Community {id: $communityId})
				CREATE (project:Project {
					id: $projectId,
					ownerId: $ownerId,
					communityId: $communityId,
					title: $title,
					description: $description,
					status: 'DRAFT',
					createdAt: $now
				})
				MERGE (owner)-[:CONTRIBUTED_TO {role: 'OWNER', createdAt: $now}]->(project)
				MERGE (community)-[:HOSTS]->(project)
				RETURN project AS project
			`,
			{
				projectId,
				ownerId: parsed.ownerId,
				communityId: parsed.communityId,
				title: parsed.title,
				description: parsed.description,
				now,
			},
			row => ProjectNodeSchema.parse(row.project),
		);

		const project = rows[0];
		await Promise.all([
			invalidateCachePattern(cacheKey('community', parsed.communityId, '*')),
			invalidateCachePattern(cacheKey('derived', 'trending', '*')),
		]);

		return project;
	},

	async publishArtifact(input: PublishArtifactRequest): Promise<ArtifactNode> {
		const parsed = PublishArtifactRequestSchema.parse(input);
		const now = Date.now();
		const artifactId = crypto.randomUUID();

		const rows = await runWrite(
			`
				MATCH (author:User {id: $userId})
				MATCH (project:Project {id: $projectId})
				CREATE (artifact:Artifact {
					id: $artifactId,
					projectId: $projectId,
					authorId: $userId,
					title: $title,
					contentUrl: $contentUrl,
					contentType: $contentType,
					createdAt: $now
				})
				MERGE (project)-[:CONTAINS]->(artifact)
				MERGE (author)-[:AUTHORED {createdAt: $now}]->(artifact)
				RETURN artifact AS artifact
			`,
			{
				artifactId,
				userId: parsed.userId,
				projectId: parsed.projectId,
				title: parsed.artifactData.title,
				contentUrl: parsed.artifactData.contentUrl,
				contentType: parsed.artifactData.contentType ?? 'OTHER',
				now,
			},
			row => ArtifactNodeSchema.parse(row.artifact),
		);

		const artifact = rows[0];
		await Promise.all([
			invalidateCachePattern(cacheKey('community', '*')),
			invalidateCachePattern(cacheKey('derived', 'trending', '*')),
		]);

		return artifact;
	},

	async contributeToProject(userId: string, projectId: string, role: string): Promise<void> {
		const parsed = ContributeInputSchema.parse({ userId, projectId, role });
		const now = Date.now();

		await runWrite(
			`
				MATCH (u:User {id: $userId})
				MATCH (p:Project {id: $projectId})
				MERGE (u)-[r:CONTRIBUTED_TO]->(p)
				ON CREATE SET r.createdAt = $now
				SET r.role = $role
				RETURN p.id AS projectId
			`,
			{
				userId: parsed.userId,
				projectId: parsed.projectId,
				role: parsed.role,
				now,
			},
			row => row.projectId,
		);

		await Promise.all([
			invalidateCachePattern(cacheKey('community', '*')),
			invalidateCachePattern(cacheKey('derived', 'recommended', parsed.userId, '*')),
		]);
	},
};

