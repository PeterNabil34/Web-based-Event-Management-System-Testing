import { Builder, By, Key, until } from 'selenium-webdriver';
import { expect } from 'chai';
import fs from "fs";

let driver;
const url = 'http://localhost:3000';

describe('Smoke Testing (and RSVP functionality)', () => {
    before(async () => {
        driver = await new Builder().forBrowser('MicrosoftEdge').build();
    });

    beforeEach(async () => {
        await driver.get(`${url}`);
    });

    after(async () => {
        await driver.quit();
    });

    it('should allow the admin to login then create an event then logout then the user login then rsvp the created event then logout then the admin login again and delete the created event', async () => {
        await driver.findElement(By.css("a[href='/login']")).click();
        await driver.findElement(By.xpath("//form/div[1]/div/input")).sendKeys('admin@project.com');
        await driver.findElement(By.xpath("//form/div[2]/div/input")).sendKeys('admin123');
        await driver.findElement(By.xpath("//form/button")).click();
        await driver.wait(until.elementLocated(By.xpath("//a[text()='Dashboard']")), 5000).click();
        await driver.findElement(By.xpath("//input[@name='name']")).sendKeys('First Automated Event');
        await driver.findElement(By.xpath("//textarea[@name='description']")).sendKeys('Hello, Peter!');
        await driver.findElement(By.xpath("//input[@type='date']")).sendKeys('02-15-2025');
        await driver.findElement(By.xpath("//input[@type='time']")).sendKeys('01:02:AM');
        await driver.findElement(By.xpath("//input[@name='location']")).sendKeys('Cairo');
        await driver.findElement(By.css("button[type='submit']")).click();
        await driver.wait(until.elementLocated(By.xpath("//button[text()='Logout']"))).click();
        await driver.findElement(By.xpath("//form/div[1]/div/input")).sendKeys('user1@project.com');
        await driver.findElement(By.xpath("//form/div[2]/div/input")).sendKeys('newuser123');
        await driver.findElement(By.xpath("//form/button")).click();
        await driver.wait(until.elementLocated(By.xpath("//div/div/div/div[2]/div/button"))).click(); //rsvp the second event by NewUser
        const RSVPconfirmation = await driver.wait(until.elementLocated(By.xpath("//div/div/div/div[2]/div/div/p[2]"))).getText();
        expect(RSVPconfirmation).to.equal('You have RSVPed to this event.');
        await driver.wait(until.elementLocated(By.xpath("//button[text()='Logout']"))).click();
        await driver.findElement(By.xpath("//form/div[1]/div/input")).sendKeys('admin@project.com');
        await driver.findElement(By.xpath("//form/div[2]/div/input")).sendKeys('admin123');
        await driver.findElement(By.xpath("//form/button")).click();
        await driver.wait(until.elementLocated(By.xpath("//div/div/div/div[2]/div/button"))).click(); //Delete the second event by Admin 
    });
});

describe('Integration Testing', () => {
    before(async () => {
        driver = await new Builder().forBrowser('MicrosoftEdge').build();
    });

    beforeEach(async () => {
        await driver.get(`${url}`);
    });

    after(async () => {
        await driver.quit();
    });
      
    it('should stay logged in as an admin after refreshing', async () => {
        await driver.findElement(By.css("a[href='/login']")).click();
        await driver.findElement(By.xpath("//form/div[1]/div/input")).sendKeys('admin@project.com');
        await driver.findElement(By.xpath("//form/div[2]/div/input")).sendKeys('admin123');
        await driver.findElement(By.xpath("//form/button")).click();
        await driver.wait(until.elementLocated(By.xpath("//a[text()='Dashboard']")), 2000);
        await driver.navigate().refresh();
        await driver.wait(until.elementLocated(By.xpath("//a[text()='Dashboard']")), 2000);
    });
});

describe('Unexpected Behaviors', () => {
    before(async () => {
        driver = await new Builder().forBrowser('MicrosoftEdge').build();
    });

    beforeEach(async () => {
        await driver.get(`${url}`);
    });

    after(async () => {
        await driver.quit();
    });
      
    it('should not allow the user to create an event', async () => {
        await driver.findElement(By.css("a[href='/login']")).click();
        await driver.findElement(By.xpath("//form/div[1]/div/input")).sendKeys('user1@project.com');
        await driver.findElement(By.xpath("//form/div[2]/div/input")).sendKeys('newuser123');
        await driver.findElement(By.xpath("//form/button")).click();
        await driver.wait(until.elementLocated(By.xpath("//button[text()='Logout']")));
        await driver.get(`${url}/dashboard`);

        if(await driver.wait(until.elementLocated(By.xpath("//h4[text()='Create New Event']")))) {
            expect(true).to.equal(false);
        }
    });
});

describe('User login and navigation', () => {
    before(async () => {
        driver = await new Builder().forBrowser('MicrosoftEdge').build();
    });

    beforeEach(async () => {
        await driver.get(`${url}`);
    });

    after(async () => {
        await driver.quit();
    });
      
    it('should allow the user to login successfully', async () => {
        await driver.findElement(By.css("a[href='/login']")).click();
        await driver.findElement(By.xpath("//form/div[1]/div/input")).sendKeys('user1@project.com');
        await driver.findElement(By.xpath("//form/div[2]/div/input")).sendKeys('newuser123');
        await driver.findElement(By.xpath("//form/button")).click();
        await driver.wait(until.elementLocated(By.xpath("//button[text()='Logout']")));
        await driver.findElement(By.xpath("//button[text()='Logout']")).click();

        /*
        await driver.findElement(By.xpath("//a[@href='/login']"));
        await driver.findElement(By.xpath("//a[text()='Login']"));
        await driver.findElement(By.xpath("//a[contains(text(),'Login')]"));
        */
        /*
        await driver.findElement(By.css("button[type='submit']")).click();
        await driver.findElement(By.xpath("//button[text()='Login']")).click();
        */
        /*
        await driver.takeScreenshot().then((image) => {
            fs.writeFileSync('screenshot.png', image, 'base64');
        });
        */
    });

    it('should allow the guest to register and create account', async () => {
        await driver.findElement(By.css("a[href='/register']")).click();
        await driver.findElement(By.xpath("//h5[text()='Register']"), 5000);
        await driver.findElement(By.xpath("//form/div[1]/div/input")).sendKeys('TestRegistrationUser');
        await driver.findElement(By.xpath("//form/div[2]/div/input")).sendKeys('testregistrationuser@project.com');
        await driver.findElement(By.xpath("//form/div[3]/div/input")).sendKeys('TestRegistrationUser123');
        await driver.findElement(By.xpath("//form/div[4]/div/input")).sendKeys('TestRegistrationUser123');
        await driver.findElement(By.xpath("//form/button")).click();
        await driver.wait(until.elementLocated(By.css("a[href='/login']"))).click();
        await driver.findElement(By.xpath("//form/div[1]/div/input")).sendKeys('testregistrationuser@project.com');
        await driver.findElement(By.xpath("//form/div[2]/div/input")).sendKeys('TestRegistrationUser123');
        await driver.findElement(By.xpath("//form/button")).click();
        await driver.wait(until.elementLocated(By.xpath("//button[text()='Logout']")), 5000);
    });
});

describe('Admin event creation and deletion', () => {
    before(async () => {
        driver = await new Builder().forBrowser('MicrosoftEdge').build();
    });

    beforeEach(async () => {
        await driver.get(`${url}`);
    });

    after(async () => {
        await driver.quit();
    });

    it('should allow the admin to login then create an event then logout', async () => {
        await driver.findElement(By.css("a[href='/login']")).click();
        await driver.findElement(By.xpath("//form/div[1]/div/input")).sendKeys('admin@project.com');
        await driver.findElement(By.xpath("//form/div[2]/div/input")).sendKeys('admin123');
        await driver.findElement(By.xpath("//form/button")).click();
        await driver.wait(until.elementLocated(By.xpath("//a[text()='Dashboard']")), 5000).click();
        await driver.findElement(By.xpath("//input[@name='name']")).sendKeys('Second Automated Event');
        await driver.findElement(By.xpath("//textarea[@name='description']")).sendKeys('This is the second event');
        await driver.findElement(By.xpath("//input[@type='date']")).sendKeys('02-18-2025');
        await driver.findElement(By.xpath("//input[@type='time']")).sendKeys('12:10:AM');
        await driver.findElement(By.xpath("//input[@name='location']")).sendKeys('Cairo');
        await driver.findElement(By.css("button[type='submit']")).click();
        const eventName = await driver.wait(until.elementLocated(By.xpath("//div/div/div/div[2]/div/div/h6"))).getText();
        expect(eventName).to.equal('Second Automated Event');
        const eventsGrid = await driver.wait(until.elementLocated(By.xpath("//div/div/div")));
        let divElements = await eventsGrid.findElements(By.css('div'));
        expect(divElements.length).to.equal(6); //2 events (each event has 3 div)
        await driver.findElement(By.xpath("//button[text()='Logout']")).click();
    });

    it('should allow the admin to login then delete the last created event (second event)', async () => {
        await driver.findElement(By.css("a[href='/login']")).click();
        await driver.findElement(By.xpath("//form/div[1]/div/input")).sendKeys('admin@project.com');
        await driver.findElement(By.xpath("//form/div[2]/div/input")).sendKeys('admin123');
        await driver.findElement(By.xpath("//form/button")).click();
        await driver.wait(until.elementLocated(By.xpath("//div/div/div/div[2]/div/button"))).click(); //Delete the second event by Admin 
        
        /*
        There is a runtime error happened here but the event has been deleted successfully
        Attached a screenshot of the error
        */

        /*
        await driver.takeScreenshot().then((image) => {
            fs.writeFileSync('Screenshot - Delete Event.png', image, 'base64');
        });
        */
        await driver.wait(until.elementLocated(By.xpath("//div/div/div")), 5000);
        const eventsGrid = await driver.wait(until.elementLocated(By.xpath("//div/div/div")));
        let divElements = await eventsGrid.findElements(By.css('div'));
        expect(divElements.length).to.equal(3); //1 event (event has 3 div)
    });
});

