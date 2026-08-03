import { test } from '@playwright/test';


    //not recommended way to bypass authentication is by embedding the credentials in the URL
    test('@bypassAuth1- Bypass Authentication by embeding credentials in URL', async ({ page }) => {
      //@https://admin:admin@the-internet-5chk.onrender.com/basic_auth
      await page.goto("https://admin:admin@the-internet-5chk.onrender.com/basic_auth"); 
    });
``

    //strongly recommended way to bypass authentication is by encoding the credentials in base64 format and passing it in the request header
    test("@bypassAuth2- Bypass Authentication by enconding credentials base64 format", async ({ page }) => {

        let encodedCredentials = Buffer.from("admin:admin").toString("base64"); //YWRtaW46YWRtaW4=

        //after having the encoded credentials, we can use it in the request header to bypass the authentication
        
       await page.setExtraHTTPHeaders({ "Authorization": `Basic ${encodedCredentials}`});

        await page.goto("https://the-internet-5chk.onrender.com/basic_auth");
    });


    /*in the 2nd test above the credentials are revelated in source code, to avoid that we can use the
      playwright config file to store the credentials in "Environment Variables" and use it in the test */

