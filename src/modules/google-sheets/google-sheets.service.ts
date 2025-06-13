import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import { WeddingApplication } from '@modules/wedding-application/wedding-application.entity';

@Injectable()
export class GoogleSheetsService {
  private sheets: any;
  private jwtClient: JWT;

  constructor(private configService: ConfigService) {
    this.initialize();
  }

  private initialize() {
    this.jwtClient = new google.auth.JWT({
      email: this.configService.get('GOOGLE_SERVICE_ACCOUNT_EMAIL'),
      key: this.configService.get('GOOGLE_PRIVATE_KEY').replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    this.sheets = google.sheets({
      version: 'v4',
      auth: this.jwtClient,
    });
  }

  async appendRow(sheetName: string, data: any[]) {
    try {
      await this.jwtClient.authorize();

      const response = await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.configService.get('GOOGLE_SHEETS_SPREADSHEET_ID'),
        range: `${sheetName}!A:Z`,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values: [data],
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error appending row:', error);
      throw error;
    }
  }

  async getSheetData(sheetName: string, range: string = 'A:Z') {
    try {
      await this.jwtClient.authorize();

      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.configService.get('GOOGLE_SHEETS_SPREADSHEET_ID'),
        range: `${sheetName}!${range}`,
      });

      return response.data.values || [];
    } catch (error) {
      console.error('Error getting sheet data:', error);
      throw error;
    }
  }

  async updateCell(sheetName: string, cell: string, value: any) {
    try {
      await this.jwtClient.authorize();

      const response = await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.configService.get('GOOGLE_SHEETS_SPREADSHEET_ID'),
        range: `${sheetName}!${cell}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[value]],
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error updating cell:', error);
      throw error;
    }
  }

  async addWeddingApplication(application: WeddingApplication) {
    const rowData = this.mapApplicationToRow(application);
    return this.appendRow('RSVPs', rowData);
  }

  async findRowByEmail(sheetName: string, email: string): Promise<{ rowNumber: number; data: any[] } | null> {
    try {
      const allData = await this.getSheetData(sheetName);
      if (!allData || allData.length === 0) return null;

      const headerRow = allData[0];

      const emailHeaderIndex = headerRow.findIndex((header) => header.toString() === 'Correo Electrónico');

      if (emailHeaderIndex === -1) return null;

      for (let i = 1; i < allData.length; i++) {
        if (allData[i][emailHeaderIndex] === email) {
          return {
            rowNumber: i + 1,
            data: allData[i],
          };
        }
      }
      return null;
    } catch (error) {
      console.error('Error finding row by email:', error);
      throw error;
    }
  }

  async writeToSheet(application: WeddingApplication): Promise<any> {
    const sheetName = 'RSVPs';
    const existingRow = await this.findRowByEmail(sheetName, application.email);

    if (!existingRow) {
      return this.addWeddingApplication(application);
    }

    const rowData = this.mapApplicationToRow(application);
    const range = `${sheetName}!A${existingRow.rowNumber}:F${existingRow.rowNumber}`;

    try {
      await this.jwtClient.authorize();

      const response = await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.configService.get('GOOGLE_SHEETS_SPREADSHEET_ID'),
        range,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [rowData],
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error updating row:', error);
      throw error;
    }
  }

  private mapApplicationToRow(application: WeddingApplication) {
    return [
      new Date().toLocaleString('es-MX', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      application.id ?? '',
      application.name ?? '',
      application.phone ?? '',
      application.email ?? '',
      application.song ?? '',
    ];
  }
}
