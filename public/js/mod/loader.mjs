
import { navMenu, subMenu } from './components.mjs';
import { main } from './calcs/app.mjs';
import { callAPI, chkResults } from './calcs/api.mjs';

ACI.UI.navMenu = navMenu;
ACI.UI.subMenu = subMenu;
ACI.calcs = main;
ACI.callAPI = callAPI;
ACI.chkAPIResults = chkResults;