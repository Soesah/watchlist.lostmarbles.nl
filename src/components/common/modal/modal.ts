import { VNode } from 'vue';

export interface ModalData {
  modal: string;
  data: any;
  confirm: Function;
  cancel?: Function;
}
