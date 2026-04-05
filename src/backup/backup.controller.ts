import { Controller, Get, Res } from '@nestjs/common';
import { BackupService } from './backup.service';
import type { Response } from 'express';

@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Get('database')
  async backupDatabase(@Res() res: Response) {
    try {
      const filePath = await this.backupService.createBackup();
      
      res.download(filePath, 'database-backup.sql', (err) => {
        if (err) console.error('Erro ao fazer download:', err);
        // Deletar arquivo após download
        this.backupService.deleteBackupFile(filePath);
      });
    } catch (error) {
      res.status(500).json({ 
        message: 'Erro ao fazer backup', 
        error: error.message 
      });
    }
  }

  @Get('status')
  async getBackupStatus() {
    return this.backupService.getStatus();
  }
}
