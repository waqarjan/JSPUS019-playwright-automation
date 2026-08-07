import { expect, test } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test.beforeEach(async ({ page }) => {
  await page.goto('https://the-internet-5chk.onrender.com/');
});

test('@fileDownload -File downloads', async ({ page }) => {

        await page.click("text='File Download'");

  //1- Clicking a download opens a Save As dialog, not a browser element, so we’ll create an event listener.

      let promisedDownloadEvent = page.waitForEvent('download'); //download event doesn't occur at this line, therefore promise will be resolved later
      await page.click("text='Artboard_Copy_16.png'");           //triggers the download event
      let download = await promisedDownloadEvent;               //once the promise is resolved it'll return the download object (Save As dialog)

  //2- Next is to create the path of destination directory

      let downloadPath = path.join(__dirname, "./downloads", download.suggestedFilename());
      await download.saveAs(downloadPath);

  //3- verify the file exist. impot fs from 'fs' library

      expect ( fs.existsSync(downloadPath) ).toBeTruthy() ;

});



test('@fileUpload -File uploads', async ({ page }) => {
  
      await page.click("text='File Upload'");
      
  // We don't event listener for uploading a file since playwright provide a built in method

  //1- get the path of the file, and the file name

      let filePath = path.join(__dirname, './uploads', 'TestUpload.txt');

  //2- select the file in the page

      await page.setInputFiles("//input[@id='file-upload']", filePath);   //1st arugment will click choose file button

  //3- upload the file to the page

      await page.click("//input[@id='file-submit']");                     //upload the file

  //4- verify file upload

      expect(page.getByText('File Uploaded!'));
});