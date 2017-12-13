import * as WebRequest from 'web-request';
import * as YearMonthDay from 'yyyy-mm-dd';

const aToken = ''; // generate this on id.getharvest.com
const accountId = ''; // you can find this on id.getharvest.com
const userAgent = 'Harvest Logger Alexa Skill';
const harvestHeaders = {
    'User-Agent': userAgent,
    'Authorization': `Bearer ${aToken}`,
    'Harvest-Account-Id': accountId
}

const requestMeFromHarvestAsync = async () => {
    try {
        return WebRequest.json<any>('https://api.harvestapp.com/v2/users/me', {
            headers: harvestHeaders
        });
    } catch (err) {
        console.log('requestMe error => ' + err)
    }
}

const requestMyAssignmentsAsync = async () => {
    try {
        const data = await WebRequest.json<any>('https://api.harvestapp.com/v2/users/me/project_assignments', {
            headers: harvestHeaders
        });
        console.log(data);
        return data;
    } catch (err) {
        console.log(err);
    }
}

const createTimeEntryAsync = async (projectId, taskId, hours) => {
    const meResponse = await requestMeFromHarvestAsync();
    const body = {
        user_id: meResponse.id,
        project_id: projectId,
        task_id: taskId,
        spent_date: `${YearMonthDay()}`,
        hours: `${hours}`
    };
    const url = 'https://api.harvestapp.com/v2/time_entries';
    console.log(body);
    try {
        const response = await WebRequest.post(url, { headers: harvestHeaders, json: true }, body);
        const statusCode = response.statusCode;
        console.log('status code:');
        console.log(statusCode);
        return statusCode;
    } catch (err) {
        console.log(err);
    }
}

export { requestMeFromHarvestAsync, requestMyAssignmentsAsync, createTimeEntryAsync }