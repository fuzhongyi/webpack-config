import {getUUID} from '../utils';
import $ from 'jquery';

require(['./a'], f => f);

console.log('b.js', getUUID());
