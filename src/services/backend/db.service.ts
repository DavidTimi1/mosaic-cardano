import { runWrite } from "./shared"



export const dbService = {

    async enforceConstraints() {
        await runWrite(`
            // Ensure unique lookups for fast index operations
            CREATE CONSTRAINT unique_user_id IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE;
            CREATE CONSTRAINT unique_community_id IF NOT EXISTS FOR (c:Community) REQUIRE c.id IS UNIQUE;
            CREATE CONSTRAINT unique_project_id IF NOT EXISTS FOR (p:Project) REQUIRE p.id IS UNIQUE;
            CREATE CONSTRAINT unique_artifact_id IF NOT EXISTS FOR (a:Artifact) REQUIRE a.id IS UNIQUE;
            CREATE CONSTRAINT unique_skill_name IF NOT EXISTS FOR (s:Skill) REQUIRE s.name IS UNIQUE;
            CREATE CONSTRAINT unique_topic_name IF NOT EXISTS FOR (t:Topic) REQUIRE t.name IS UNIQUE;

            // Create Lookup Indexes for performance during rapid social searches
            CREATE INDEX user_username_idx IF NOT EXISTS FOR (u:User) ON (u.username);
            CREATE INDEX artifact_type_idx IF NOT EXISTS FOR (a:Artifact) ON (a.type);
        `, {}, () => null);
    }
}