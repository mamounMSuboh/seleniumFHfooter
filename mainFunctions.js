const {Builder, By, Select, until} = require('selenium-webdriver');
const driver = new Builder().forBrowser('chrome').build();

module.exports.openPage = async (pageURL) => {
    try {
        await driver.get(pageURL);
        await driver.manage().window().maximize();
    } catch (e) {
        return e;
    }

};
module.exports.quit = async () => {
    try {
        driver.quit();
    } catch (e) {
        return e
    }

}
module.exports.scrollToElementByID = async (id) => {
    try {
        let el = await driver.wait(until.elementLocated(By.id(id)), 10000);
        await driver.executeScript("arguments[0].scrollIntoView(true);", el);
    } catch (e) {

    }
}
module.exports.scrollToElementByCss = async (css) => {
    try {
        let el = await driver.wait(until.elementLocated(By.css(css)), 10000);
        await driver.executeScript("arguments[0].scrollIntoView(true);", el);
    } catch (e) {

    }

}
module.exports.waitForElement = async (name) => {
    try {

        let ele = await driver.wait(until.elementLocated(By.className(name)), 10000);
        return ele;
    } catch (e) {

    }
}

module.exports.refreshPage = async () => {
    await driver.navigate().refresh();
}

module.exports.waitFor = (time) => {
    let currentTime = new Date().getTime();
    while (currentTime + time >= new Date().getTime()) {
    }
};

module.exports.clearBox = async (id) => {
    try {
        return await driver.findElement(By.id(id)).clear();
    } catch (e) {
        return false;
    }
};

module.exports.sendKeyToElementByClassName = async (text, key) => {
    try {
        return await driver.findElement(By.className(text)).sendKeys(key);
    } catch (e) {
        console.log(e)
        return false;
    }
};
module.exports.sendKeyToElementByID = async (id, key) => {
    try {
        return await driver.findElement(By.id(id)).sendKeys(key);
    } catch (e) {
        console.log(e)
        return false;
    }
};
module.exports.clickElement = async (css) => {
    try {

        return await driver.findElement(By.css(css)).click();
    } catch (e) {
        console.log("e", e)
        return false;
    }
};
module.exports.clickElementByClassName = async (className) => {
    try {

        return await driver.findElement(By.className(className)).click();
    } catch (e) {
        return false;
    }
};
module.exports.getElements = async (element) => {
    try {
        return await driver.findElements(By.css(element));
    } catch (e) {
        return false;
    }
};
module.exports.scrollPage = async () => {
    await driver.executeScript("window.scrollBy(0,200)");
    await this.waitFor(2000);
    await driver.executeScript("window.scrollBy(0,200)");
}
module.exports.scrollPageUp = async () => {
    await driver.executeScript("window.scrollBy(0,-200)");
    await this.waitFor(2000);
    await driver.executeScript("window.scrollBy(0,-200)");
}

module.exports.selectDropDown = async (CSS, index) => {
    try {
        let se = new Select(await driver.findElement(By.css(CSS)));
        await se.selectByValue(index);
    } catch (e) {

    }

}
module.exports.convertStringToNumber = (str, value) => {
    str = str.replace('$', '');
    str = str.replace(',', '');
    str = str.replace('%', '');
    if (value === 'int')
        return parseInt(str)
    else
        return parseFloat(str);
}




