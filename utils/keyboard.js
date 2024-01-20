import { Keyboard } from 'grammy';

export const keyboard = new Keyboard()
  .text('Login')
  .row()
  .text('Add coin')
  .text('List')
  .row()
  .resized()
  .persistent();
