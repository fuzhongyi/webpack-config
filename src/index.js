import $ from 'jquery';
import './index.css';
import './js/b';
import {getUUID} from "./utils";
import google from './assets/google.png'

$ ('body').prepend(`<p>${_.max([1, 21, 3])}</p>`);
console.table({'image': google});
console.log('getUUID', getUUID());
