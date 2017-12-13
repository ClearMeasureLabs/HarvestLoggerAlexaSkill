import * as Alexa from 'alexa-sdk';
import { Intent, IntentRequest, LaunchRequest, Request } from 'alexa-sdk';
import * as HarvestApi from './harvestApi';
import { doListIntentAsync, doSelectIntentAsync } from './listAndSelect';

export const entrypoint = (event, context, callback) => {

  const alexa = Alexa.handler(event, context);
  alexa.appId = '' // you can find this in the Amazon Developer Portal for your Alexa skill
  // const aToken = event.session.user.accessToken;

  const handlers = {
    'LaunchRequest': async function () {
      const self: Alexa.Handler<IntentRequest> = this;
      const data = await HarvestApi.requestMeFromHarvestAsync();
      console.log(data);
      const output: string = `Hello ${data.first_name}, welcome to Harvest Logger!`;
      self.emit(':ask', output);
    },
    'SessionEndedRequest': async function () {
      this.emit(':tell', 'Goodbye');
    },
    'AMAZON.HelpIntent': async function () {
      let self: Alexa.Handler<IntentRequest> = this;
      let output: string = 'For now, just say clients';
      self.emit(':ask', output);
    },
    'AMAZON.StopIntent': async function () {
      let self: Alexa.Handler<IntentRequest> = this;
      let output: string = 'Goodbye';
      self.emit(':tellWithCard', output);
    },
    'ListClientsIntent': async function () {
      const output = await doListIntentAsync('clients');
      this.emit(':ask', output);
    },
    'ListProjectsIntent': async function () {
      const output = await doListIntentAsync('projects');
      this.emit(':ask', output);
    },
    'ListTasksIntent': async function () {
      const output = await doListIntentAsync('tasks');
      this.emit(':ask', output);
    },
    'SelectClientIntent': async function () {
      const spokenSelection = this.event.request.intent.slots.Client.value;
      const result = await doSelectIntentAsync(spokenSelection, 'client');
      this.attributes[`selectedClient`] = result.selection;
      const output = result.output;
      this.emit(':ask', output);
    },
    'SelectProjectIntent': async function () {
      const spokenSelection = this.event.request.intent.slots.Project.value;
      const result = await doSelectIntentAsync(spokenSelection, 'project');
      this.attributes[`selectedProject`] = result.selection;
      const output = result.output;
      this.emit(':ask', output);
    },
    'SelectTaskIntent': async function () {
      const spokenSelection = this.event.request.intent.slots.Task.value;
      const result = await doSelectIntentAsync(spokenSelection, 'task');
      this.attributes[`selectedTask`] = result.selection;
      const output = result.output;
      this.emit(':ask', output);
    },
    'LogTimeIntent': async function () {
      const hoursSlot = this.event.request.intent.slots.Hours.value;
      const selectedClient = this.attributes['selectedClient'];
      const selectedProject = this.attributes['selectedProject'];
      const selectedTask = this.attributes['selectedTask'];

      if (!selectedProject) {
        this.emit(':ask', 'You must select a project first!');
      }
      if (!selectedTask) {
        this.emit(':ask', 'You must select a task first!');
      }

      const responseCode = await HarvestApi.createTimeEntryAsync(selectedProject.id, selectedTask.id, hoursSlot);
      if (responseCode != 201) {
        this.emit(':ask', `The log failed with status code ${responseCode}`);
      }

      const output = `Successfully logged ${hoursSlot} hours `
        // + `for client ${selectedClient.name} `
        + `for project ${selectedProject.name} `
        + `for task ${selectedTask.name}.`;
      this.emit(':tell', output);
    },
    'DebugIntent': async function () {
      const data = this.attributes;
      console.log(data);
      const output: string = `Debugging`;
      this.emit(':tellWithCard', output, 'Debug', output);
    }
  }

  alexa.registerHandlers(handlers);
  alexa.execute();
}

