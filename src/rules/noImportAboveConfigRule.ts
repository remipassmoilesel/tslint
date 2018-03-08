/**
 * @license
 * Copyright 2015 Palantir Technologies, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { findImports, ImportKind } from "tsutils";
import * as ts from "typescript";

import * as Lint from "../index";

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "no-import-above-config",
        description: "Required that imports be limited to the subfolders of the nearest tslint.json",
        descriptionDetails: Lint.Utils.dedent`
            `,
        hasFix: true,
        optionsDescription: Lint.Utils.dedent`

            ├── project1
            │   ├── src
            │   ├── tests
            │   ├── tslint.json
            │   ├── node_modules
            │   └── build
            ├── project2
            │   ├── src
            │   ├── tests
            │   ├── tslint.json
            │   ├── tests/utils.ts
            │   │
            │   │   import * as _ from 'lodash';
            │   │   import * as sinon from 'sinon';
            │   │   import * as {SuperEntity} from "../project1/src/entities/somewhere/deeper/";
            │   │                                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            │   │                                   Should be "project1"
            │   ├── node_modules
            │   └── build
            └── MySuperProject.md

        `,
        options: {
            type: "object",
            properties: {
                "grouped-imports": {
                    type: "boolean",
                },
            },
            additionalProperties: false,
        },
        optionExamples: [
            true,
            [true, {"grouped-import": "true"}],
        ],
        type: "style",
        typescriptOnly: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Import above nearest tsconfig.json, should be '%s' ?";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

const fs = require("fs");
const CircularJSON = require('circular-json');
fs.existsSync('/tmp')

function walk(ctx: Lint.WalkContext<void>) {
    for (const name of findImports(ctx.sourceFile, ImportKind.AllRequireLike)) {
        console.log(CircularJSON.stringify(name, null, 2));
//        ctx.addFailureAtNode(name.parent!, Rule.FAILURE_STRING);
    }
}
