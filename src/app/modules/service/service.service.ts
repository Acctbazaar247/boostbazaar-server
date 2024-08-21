import axios from 'axios';
import config from '../../../config';
import { TService } from './service.interface';

const getAllService = async (): Promise<TService[]> => {
  console.log('hi');
  const response = await axios.post(config.japUrl, {
    key: config.japApiKey,
    action: 'services',
  });

  const services = response.data;

  // Filter services for Facebook
  // const facebookServices = services.filter(service =>
  //   service.name.toLowerCase().includes('facebook')
  // );

  // console.log(facebookServices);

  return services;
};

export const ServiceService = {
  getAllService,
};
