import axios from "axios";
import { AppConfiguration, AppServices } from "./abstractions";
import { defaultAppSessionState } from "./abstractions/app-session/app-session-state";
import { AppConfigurationRendererImplementation } from "./implementations/app-configuration-renderer";
import {
  //
  PullingAppSessionStateMonitor,
} from "./implementations/app-session/pulling-app-session-state-monitor";
import {
  ServicesFactories,
  SingletonLazyAppServicesContainer,
} from "./implementations/SingletonLazyAppServicesContainer";
import { defaultAppConfiguration } from "./default-configuration";
import { DopplerLegacyClientImpl } from "./implementations/DopplerLegacyClientImpl";

export const configureApp = (
  customConfiguration: Partial<AppConfiguration>
): AppServices => {
  const appConfiguration = {
    ...defaultAppConfiguration,
    ...customConfiguration,
  };

  const appSessionStateWrapper = {
    current: defaultAppSessionState,
  };

  const factories: ServicesFactories = {
    windowFactory: () => window,
    axiosStaticFactory: () => axios,
    appConfigurationFactory: () => appConfiguration,
    appConfigurationRendererFactory: (appServices: AppServices) =>
      new AppConfigurationRendererImplementation(appServices),
    dopplerLegacyClientFactory: (appServices: AppServices) =>
      new DopplerLegacyClientImpl({
        axiosStatic: appServices.axiosStatic,
        appConfiguration: appServices.appConfiguration,
      }),
    appSessionStateAccessorFactory: () => appSessionStateWrapper,
    appSessionStateMonitorFactory: (appServices: AppServices) =>
      new PullingAppSessionStateMonitor({
        appSessionStateWrapper,
        appServices,
      }),
  };

  const appServices = new SingletonLazyAppServicesContainer(factories);

  return appServices;
};
