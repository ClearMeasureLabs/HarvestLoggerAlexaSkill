import * as FuzzyMatching from 'fuzzy-matching';
var stripchar = require('stripchar').StripChar;
import * as HarvestApi from './harvestApi';

const doListIntentAsync = async (listWhat): Promise<string> => {
    try {
        let data;
        switch (listWhat) {
            case 'clients':
                data = await listMyClientsAsync();
                break;
            case 'projects':
                data = await listMyProjectsAsync();
                break;
            case 'tasks':
                data = await listMyTasksAsync();
                break;
        }
        console.log(data);
        const names = data.map(d => d.name);
        const output: string = `Your ${listWhat} are: ${names.join('; ')}.`
        console.log(output);
        return output;
    } catch (err) {
        console.log(err);
    }
}

const doSelectIntentAsync = async (spokenSelection, selectWhat) => {
    try {
        let options;
        switch (selectWhat) {
            case 'client':
                options = await listMyClientsAsync();
                break;
            case 'project':
                options = await listMyProjectsAsync();
                break;
            case 'task':
                options = await listMyTasksAsync();
                break;
        }
        console.log('options:')
        console.log(options);
        const fm = new FuzzyMatching(options.map(p => p.name));
        const bestMatch = fm.get(spokenSelection).value;
        let output = `I couldn't find that ${selectWhat}. Please try again.`;
        let selection;
        options.forEach(element => {
            if (element.name == bestMatch) {
                selection = element;
                output = `Selected ${selectWhat} ${element.name}`;
            }
        });
        return { selection: selection, output: output };
    } catch (err) {
        console.log(err);
    }
}



const listMyClientsAsync = async () => {
    const json = await HarvestApi.requestMyAssignmentsAsync();
    const myClientsStrings = json.project_assignments.map(p => `${p.client.name};${p.client.id}`);
    const myClientsStringsUnique: any = Array.from(new Set(myClientsStrings));
    const myClients = myClientsStringsUnique.map(c => (
        {
            name: stripchar.RSExceptUnsAlpNum(c.split(';')[0]),
            id: c.split(';')[1]
        }
    ));
    console.log(myClients);
    return myClients;
}

const listMyProjectsAsync = async () => {
    const json = await HarvestApi.requestMyAssignmentsAsync();
    const myProjects = json.project_assignments.map(p => (
        {
            name: stripchar.RSExceptUnsAlpNum(p.project.name),
            id: p.project.id
        }
    ));
    return myProjects;
}

const listMyTasksAsync = async () => {
    const myAssignmentsJson = await HarvestApi.requestMyAssignmentsAsync();
    let myTasks = [];
    myAssignmentsJson.project_assignments.map(p =>
        p.task_assignments.map(t => myTasks.push(
            {
                name: stripchar.RSExceptUnsAlpNum(t.task.name),
                id: t.task.id
            }
        ))
    );
    return myTasks;
}

export { doListIntentAsync, doSelectIntentAsync }