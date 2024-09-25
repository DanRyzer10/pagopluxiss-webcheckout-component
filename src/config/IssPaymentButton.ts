import {ContainerNode, h,render} from 'preact';
import { config } from './types/setup';
import { PaymentButton } from '../app';

class IssPaymentButton {
    private config:config;
    private container:ContainerNode | null;
    private readonly services:{
        service_key:string,
        service_bridge:string
    }

    constructor(setup:config){
        this.config = setup;
        this.container = document.getElementById('iss-payment-button');
        this.services = {
            service_key:'/api/webcheckout/send-payform',
            service_bridge:'/api/webcheckout/sendPayform'
        }
        this.initialize();
    }

    private initialize(){
        if(!this.config) throw new Error('Error al renderizar el componente')
        else
        this.renderButton();
    }
    private renderButton(){
        if (this.container) {
            render(
                h(PaymentButton, { config: this.config, services: this.services }),
                this.container
            );
        } else {
            throw new Error('Container element not found');
        }
    }
}
export default IssPaymentButton;
