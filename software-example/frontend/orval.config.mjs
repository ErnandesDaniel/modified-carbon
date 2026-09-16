

import {defineConfig} from 'orval';

export default defineConfig({
    'ai-graph-chat':{
        input:"./src/api/rest-client/openapi.json",
        output:{
            client:"react-query",
            mock:true,
            override:{
                mutator:{
                    name:'restApiAxiosClient',
                    path: './src/api/rest-client/restApiAxiosClient.ts'
                }
            },
            schemas:'./src/api/rest-client/dto',
            target:'./src/api/rest-client/index.ts',
        }
    }
});