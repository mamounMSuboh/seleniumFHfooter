jest.setTimeout(500000);
const browser = require('./mainFunctions');
const {selectors} = require('./Selectors.js')
const {credentials} = require('./testData');

const insertRate = 5.5;
//must be 30 or 15 only
const loanLifeOption = '15 Years Fixed';
const loanLifeInMonths = 180;

let propertyPrice = 0, cashToCashReturn = 0, comparableIncome = 0, cashFlow = 0;
let loanAmountValue = 0, downPaymentValue = 0, monthlyMortgage = 0, monthlyExpense = 0;
describe('Test the Mortgage Calculations', () => {

    it('Login with Username and password', async () => {

        await browser.openPage('https://www.mashvisor.com/auth');
        await browser.waitForElement(selectors.login_ok_button);
        await browser.sendKeyToElementByClassName(selectors.login_user_name, credentials.userName);
        await browser.sendKeyToElementByClassName(selectors.login_password, credentials.password);
        await browser.clickElementByClassName(selectors.login_ok_button);

        await browser.waitForElement(selectors.main_map_id);

        await browser.waitForElement(selectors.main_nav_bar);

    });

    it('Select the first property ', async () => {

        // Click the first property in the search results
        let propertyCard = await browser.getElements(selectors.firstProperty);
        await propertyCard[0].click();
        // wait until the first search result open
        await browser.waitForElement(selectors.Property_popup_header);

        // Refresh to avoid the popups
        await browser.refreshPage();
    });
    it('Move to the Mortgage calculator and check the Mortgage checkbox', async () => {
        await browser.scrollPage();
        await browser.scrollPage();
        await browser.scrollToElementByID(selectors.mortgage_Panel);

        await browser.scrollPageUp();

        //click the radio button to change to Mortgage option
        await browser.clickElement(selectors.mortgage_checkBox);
    });
    it('Read the Property values in the calculator', async () => {

        let getPropertyPrices = await browser.getElements(selectors.property_Price);
        propertyPrice = await getPropertyPrices[1].getText()
        propertyPrice = browser.convertStringToNumber(propertyPrice, 'int');

        let getDownPayments = await browser.getElements(selectors.down_loan_value);
        downPaymentValue = await getDownPayments[0].getText();
        downPaymentValue = browser.convertStringToNumber(downPaymentValue, 'int');


        loanAmountValue = await getDownPayments[3].getText();
        loanAmountValue = browser.convertStringToNumber(loanAmountValue, 'int');


    });
    it('Change the Values ', async () => {
        await browser.selectDropDown(selectors.loan_life, loanLifeOption);
        await browser.waitFor(1000);
        await browser.clearBox(selectors.inserted_rate);
        await browser.waitFor(1000);
        await browser.sendKeyToElementByID(selectors.inserted_rate, insertRate);

    });
    it('Get the Rental Strategy Table ', async () => {
        await browser.scrollToElementByCss(selectors.rental_strategy_panel);
        await browser.scrollPageUp();

        //Click the Monthly To open and show the mortgage values
        await browser.clickElementByClassName(selectors.monthly_expense_button);

        let getMonthlyMortgage = await browser.getElements(selectors.monthly_mortgage);
        monthlyMortgage = await getMonthlyMortgage[0].getText();
        monthlyMortgage = await browser.convertStringToNumber(monthlyMortgage, 'float');


        let getMonthlyExpense = await browser.getElements(selectors.monthly_expense_value);
        monthlyExpense = await getMonthlyExpense[0].getText();
        monthlyExpense = await browser.convertStringToNumber(monthlyExpense, 'float');


        cashToCashReturn = await getMonthlyExpense[2].getText();
        cashToCashReturn = await browser.convertStringToNumber(cashToCashReturn, 'float');


        let getComparableIncome = await browser.getElements(selectors.compare_value);
        comparableIncome = await getComparableIncome[0].getAttribute('value');
        comparableIncome = await browser.convertStringToNumber(comparableIncome, 'float');

        let getCashFlow = await browser.getElements(selectors.cash_flow);
        cashFlow = await getCashFlow[0].getText();
        cashFlow = await browser.convertStringToNumber(cashFlow, 'float');
    });
    it('Check the Mortgage Value ', async () => {
        let insertRatePerMonth = insertRate / 1200;
        let mortgage = loanAmountValue * ((insertRatePerMonth * Math.pow(insertRatePerMonth + 1, loanLifeInMonths) / (Math.pow(insertRatePerMonth + 1, loanLifeInMonths) - 1)));
        mortgage = Math.round(mortgage);
        expect(mortgage).toBe(monthlyMortgage);

    });

    it('Check the Cash Flow Value ', async () => {
        expect(cashFlow).toBe(comparableIncome - monthlyExpense);
    });

    it('Check the Cash Flow Value ', async () => {
        let cashToCashRet = cashFlow * 12 / (8000 + downPaymentValue);
        let newVal = ('per' + (cashToCashRet * 100).toFixed(2).replace(/\.+$/, ''));
        expect(newVal).toBe(cashToCashReturn);
    });
});