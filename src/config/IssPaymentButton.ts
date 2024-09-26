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
        this.initialize(this.config);
    }

    private initialize(config: any) {
        const validateConfig = (config: any): string[] => {
            const errors: string[] = [];
    
            const requiredConfigProperties: { [key: string]: string | object } = {
                setting: {
                    production: 'boolean',
                    code: 'string',
                    authorization: 'string',
                    secretKey: 'string',
                    simetricKey: 'string'
                },
                business: {
                    name: 'string',
                    email: 'string',
                    country: 'string',
                    country_code: 'string',
                    phonenumber: 'string'
                },
                reference_id: 'string',
                module: 'string',
                currency: 'string',
                total_amount: 'number',
                installmentCredit: 'object',
                buyer: {
                    document_type: 'string',
                    identity: 'string',
                    names: 'string',
                    lastnames: 'string',
                    email: 'string',
                    countrycode: 'string',
                    phonenumber: 'string',
                    ipaddress: 'string'
                },
                shipping_address: {
                    country: 'string',
                    state: 'string',
                    city: 'string',
                    Zipcode: 'string',
                    street: 'string'
                },
                redirect_url: 'string',
            };
    
            const validateObject = (obj: any, schema: any, path: string = ''): void => {
                for (const key in schema) {
                    const fullPath = path ? `${path}.${key}` : key;
                    if (typeof schema[key] === 'object' && !Array.isArray(schema[key])) {
                        if (!obj[key]) {
                            errors.push(`Missing property: ${fullPath}`);
                        } else {
                            validateObject(obj[key], schema[key], fullPath);
                        }
                    } else {
                        if (!obj.hasOwnProperty(key)) {
                            errors.push(`Missing property: ${fullPath}`);
                        } else if (typeof obj[key] !== schema[key]) {
                            errors.push(`Invalid type for property: ${fullPath}. Expected ${schema[key]}, but got ${typeof obj[key]}`);
                        }
                    }
                }
            };
    
            validateObject(config, requiredConfigProperties);
    
            return errors;
        };
    
        const errors = validateConfig(config);
    
        if (errors.length > 0) {
            console.error(`Config validation errors:\n${errors.join('\n')}`);
            throw new Error('Error al renderizar el componente');
        } else {
            this.renderButton();
        }
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
