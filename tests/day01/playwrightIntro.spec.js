//COMMON/OLD WAY OF JS IMPORTING
    //const{test} = require("@playwright/test");
    
//NEW WAY OF JS IMPORTING from ES MODULES
import { test } from 'playwright/test';



 test("", async({page})=>{
    //test code goes here

   await page.goto("https://www.saucedemo.com/");

   await page.waitForTimeout(5000);

 })