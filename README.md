# angular-http-progress
Wrapper for https://github.com/victorbjelkholm/ngprogress - automatically handles http progress with interceptor

[![Build Status](https://travis-ci.org/spira/angular-http-progress.svg?branch=master)](https://travis-ci.org/spira/angular-http-progress) 
[![Coverage Status](https://coveralls.io/repos/spira/angular-http-progress/badge.svg?branch=master)](https://coveralls.io/r/spira/angular-http-progress?branch=master)
[![Dependency Status](https://gemnasium.com/spira/angular-http-progress.svg)](https://gemnasium.com/spira/angular-http-progress)
[![npm version](https://badge.fury.io/js/angular-http-progress.svg)](http://badge.fury.io/js/angular-http-progress)

## Intro
This module wraps https://github.com/victorbjelkholm/ngprogress, adding an interceptor for reporting progress of
 http requests and various throttling fixes to stop overloading the site progress module.
   
## Installation

Install with npm:

```sh
npm install angular-http-progress --save
```

## Usage

* Require the `ngHttpProgress` module in your angular application

```ts

    import "angular-http-progress";
    
    angular.module('app', ['ngHttpProgress']);
    
```

* (Optionally) configure the service provider

```ts

    import {NgHttpProgressServiceProvider} from "angular-http-progress";
    
    angular.module('app', ['ngHttpProgress'])
    .config(['ngHttpProgress', function(ngHttpProgressProvider:NgHttpProgressServiceProvider){
        ngHttpProgressProvider
            .configure({
                color: '#ff000',
                height: '10px'
            })
        ;
    }]);

```

* ???
* Profit! All outgoing http requests will start or bump the progress meter, when all pending requests are resolved, 
the progress bar will complete.
