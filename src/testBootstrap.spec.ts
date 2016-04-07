import "angular";
import "angular-mocks";
import "./ngHttpProgress";
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
// import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

chai.use(chaiAsPromised);
chai.use(sinonChai);


export * from "./fixtures.spec";
export * from "./ngHttpProgress";
export const expect = chai.expect;
export const sinon = sinon;