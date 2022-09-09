### Config's Multiple Node Instances
https://github.com/lorenwest/node-config/wiki/Multiple-Node-Instances

#### nodejs 6+ naming standard is:
```
<NODE_ENV>-<NODE_APP_INSTANCE>.json
```

where NODE_APP_INSTANCE in {int, qa, or prod} and NODE_ENV = production (these variables are set in the int/qa/perf/prod environments by Kubernetes Config Maps - see your kubernetes.yml file for the setting of these variables from the map)

**production.json does NOT refer to the production environment. (production-prod.json refers to the to production environment.)** It is the default config. attributes here are inherited in any config file that starts with 'production-'

The reason for this is to enable express performance optimizations.

Your config directory should have:
- README.md
- default.json          <== defaults for all environments
- development-int.json  <== Local development, inherits from development.json
- development.json      <== Local development defaults, inherits from default.json
- production-int.json   <== Int environment, inherits from production.json
- production-prod.json  <== Prod environment, inherits from production.json
- production-qa.json    <== QA environment, inherits from production.json
- production.json       <== non-development defaults (i.e. Int/QA/Perf/Prod), inherits from default.json

default.json is the default config. attributes here are inherited in any config file that matches ```<NODE_ENV>-<NODE-APP-INSTANCE>```.json

Config logic will first search for a variable in the ```<NODE_ENV>-<NODE_APP_INSTANCE>```.json file - i.e. production-int (assuming NODE_ENV is production and NODE_APP_INSTANCE is int).  If the variable is not found there, it will look in ```<NODE_ENV>```.json config file - i.e. production.json.  If not found there, it will lastly look for the variable in default.json. If it does not find the variable in default.json, an error will be thrown.

#### nodejs 4 naming standard is:
```
<NODE_ENV>.json
```

where NODE_ENV in {int, qa, or prod}

default.json is the default config. attributes here are inherited in any config file that matches ```<NODE_ENV>```.json

Your config directory should have:
- default.json      <== Local development defaults
- int.json          <== Int environment, inherits from production.json
- prod.json         <== Prod environment, inherits from production.json
- qa.json           <== QA environment, inherits from production.json
