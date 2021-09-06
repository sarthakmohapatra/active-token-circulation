// import schema from './schema';
import { handlerPath } from "@libs/handlerResolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "get",
        path: "tokensupply",
        request: {
          parameters: {
            queryStrings: {
              tokensymbol: true,
            },
          },
        },
        // request: {
        //   schema: {
        //     'application/json': schema
        //   }
        // }
      },
    },
  ],
};
