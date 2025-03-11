# azure/main.bicep
param location string = resourceGroup().location
param backendAppName string
param frontendAppName string
param openAiApiKey string

@allowed([
  'F1'
  'B1'
  'S1'
])
param backendSkuName string = 'B1'

// App Service Plan for Backend
resource appServicePlan 'Microsoft.Web/serverfarms@2022-09-01' = {
  name: '${backendAppName}-plan'
  location: location
  sku: {
    name: backendSkuName
  }
  kind: 'linux'
  properties: {
    reserved: true
  }
}

// Backend App Service
resource backendApp 'Microsoft.Web/sites@2022-09-01' = {
  name: backendAppName
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'NODE|18-lts'
      appSettings: [
        {
          name: 'OPENAI_API_KEY'
          value: openAiApiKey
        }
        {
          name: 'PORT'
          value: '8080'
        }
        {
          name: 'NODE_ENV'
          value: 'production'
        }
        {
          name: 'CORS_ORIGIN'
          value: 'https://${frontendAppName}.azurestaticapps.net'
        }
      ]
    }
  }
}

// Static Web App for Frontend
resource staticWebApp 'Microsoft.Web/staticSites@2022-09-01' = {
  name: frontendAppName
  location: location
  sku: {
    name: 'Standard'
    tier: 'Standard'
  }
  properties: {
    repositoryUrl: ''
    branch: 'main'
    buildProperties: {
      appLocation: 'frontend'
      outputLocation: 'out'
    }
  }
}

// Output values
output backendUrl string = 'https://${backendApp.properties.defaultHostName}'
output frontendUrl string = 'https://${staticWebApp.properties.defaultHostName}'