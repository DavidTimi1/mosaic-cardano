import { runWrite } from './shared';

export const healthService = {
  // Triggers every 24 hours to keep the Neo4j instance hot
  async keepAlive(){
    await runWrite(
      `MERGE (m:Mosaic_Maintenance) 
       SET m.isActive = false, 
           m.lastPingAt = datetime()`,
      {},
      row => row
    );
  }
};