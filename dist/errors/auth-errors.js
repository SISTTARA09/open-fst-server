var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { SignInError } from "./error.constructors.js";
function handleCredentialsErrors(error) {
    return __awaiter(this, void 0, void 0, function* () {
        // if duplicated
        if (error.code === 11000) {
            for (let k in error.keyValue) {
                return new SignInError(k, `this ${k} is already used!!`);
            }
            ///
        }
        else {
            return error;
        }
    });
}
export { handleCredentialsErrors };
