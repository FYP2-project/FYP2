import { decryptData } from "./action";
import * as types from "./actionType";



const initialState = {
  loading: false,
  currentUser: decryptData(localStorage.getItem("user")) || null,
  error: null,
  addingStaff: false,
  addingEvent: false,
};

const userReducer =(state = initialState, action)=>{
    switch(action.type){
      case types.UPDATE_PROFILE_START:
        return {
          ...state,
          loading: true,
        };
      case types.UPDATE_PROFILE_SUCCESS:
        return {
          ...state,
          loading: false,
         
        };
      case types.UPDATE_PROFILE_FAIL:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
        case types.ADD_STUDENT_START:
          case types.ADD_TEACHER_START:
        case types.ADD_STAFF_START:
            return {
              ...state,
              addingStaff: true,
            };
          case types.ADD_STAFF_SUCCESS:
            case types.ADD_TEACHER_SUCCESS:
            case types.ADD_STUDENT_SUCCESS:
            return {
              ...state,
              addingStaff: false,
            };
          case types.ADD_STAFF_FAIL:
            case types.ADD_STUDENT_FAIL:
              case types.ADD_TEACHER_FAIL:
            return {
              ...state,
              addingStaff: false,
              error: action.payload,
            };
            case types.ADD_EVENT_START: 
            return {
              ...state,
              addingEvent: true,
            };
          case types.ADD_EVENT_SUCCESS: 
            return {
              ...state,
              addingEvent: false,
            };
          case types.ADD_EVENT_FAIL: 
            return {
              ...state,
              addingEvent: false,
              error: action.payload,
            };
        case types.LOGIN_START:
        case types.LOGOUT_START:
            return{
                ...state,
                loading:true,
            };
            case types.LOGOUT_SUCCESS: 
            return{
                ...state,
                currentUser: null,
            }
            case types.SET_USER: return{
                ...state,
                loading: false,
                currentUser: action.payload,
            }
            case types.LOGIN_SUCCESS:
                return{
                    ...state,
                    loading:false,
                    currentUser: action.payload,
                };
                case types.LOGIN_FAIL:
                case types.LOGOUT_FAIL:
                    return{
                        ...state,
                        loading:false,
                        error: action.payload,
                    };
                    case "CLEAR_ERROR":
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
}


export default userReducer;