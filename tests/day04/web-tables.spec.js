import { expect, test } from '@playwright/test';

test('@webTables -Web table Practice', async ({ page }) => {

    await page.goto('https://admin:admin@the-internet-5chk.onrender.com/web-tables');

    let table = page.locator("//table[@id='ctl00_MainContent_orderGrid']");

    //playwright let you locate an element that's inside another element

    let rows = await table.locator("//tr"); // will return first matching
    let allRows = await rows.all();         //will return all rows
    expect(allRows.length).toBe(9) ;

    let columns = await table.locator('//th').all();
    expect(columns.length).toBe(13);
    
    let cells = await table.locator('//td').all();
    expect(allCells.length).toBe(104);
 
    //print text of each cell
    for (let cell of cells){
       console.log(await cell.textContent());
    }

});


test('@webTable1 -All Rows data except first and last columns', async ({ page }) => {

  await page.goto('https://admin:admin@the-internet-5chk.onrender.com/web-tables');

  let table = page.locator("//table[@id='ctl00_MainContent_orderGrid']");
  let rows = await table.locator('//tr').all();
  let columns = await table.locator('//th').all();
  let allCells = await table.locator('//td').all();

  //exclude first and last columns
  for (let row of dataRows) {
    let cells = await row.locator('//td').all();

    for (let i = 1; i < cells.length - 1; i++) {
      console.log(await cells[i].textContent());
    }
  }
});


test('@webTable2 -1st Row data excluding 1st & 2nd columns', async ({  page}) => {

  await page.goto( 'https://admin:admin@the-internet-5chk.onrender.com/web-tables' );

  let table = page.locator("//table[@id='ctl00_MainContent_orderGrid']");
  let rows = await table.locator('//tr').all();
  let columns = await table.locator('//th').all();
  let allCells = await table.locator('//td').all();

  let firstRow = rows[1];
  let cellsOfFirstRow = await firstRow.locator('//td').all();
  for (let i = 1; i < cellsOfFirstRow.length - 1; i++) {
    console.log(await cellsOfFirstRow[i].textContent());
  }
});



test('@webTable3 -Check checkboxes of the table', async ({page}) => {
  await page.goto('https://admin:admin@the-internet-5chk.onrender.com/web-tables');

  let table = page.locator("//table[@id='ctl00_MainContent_orderGrid']");
  let rows = await table.locator('//tr').all();

  let checkBoxes = await table.locator("//input[@type='checkbox']").all();

    for(let checkbox of checkBoxes){
        await checkbox.check();
        await expect(checkbox).toBeChecked();
    }
  
});