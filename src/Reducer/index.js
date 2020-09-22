import Immutable from 'immutable'

const defaultManagerData = Immutable.fromJS({
  userid: null,
  username: null,
  isAuthenticated: false,
  isAuthenticating: false,

  isFetching: false,
  schoolId: '1',
  code: null,
  teacherData: [],
  groupData: [], 
  contractData: [],
  teacher_option: [],
  course_option: [],
  consumeLesson: [],
  search_stu_name: [],
  stu_group_option: [],
  his_contract_list: [],
  total_fee: 0,
  total_time: 0,
})

export const managerData = (state = defaultManagerData, action = {}) => {
  switch (action.type) {
    case 'LOGIN_USER_SUCCESS':
            var obj = JSON.parse(action.token);
            return state.set('isAuthenticating', false)
                    .set('isAuthenticated',true)
                    .set('username',obj.identifier)
                    .set('userid',obj.userid);
    case 'GET_DATA_START':
      return state.set('isFetching', true);
    case 'UPDATE_SCHOOL_ID':
      console.log("reducer schoolId:",action.schoolId);
      return state.set('schoolId', action.schoolId)
    case 'GET_TEACHER_LIST':
      return state.set('teacherData', Immutable.fromJS(action.json)).set('isFetching', false)
    case 'GET_GROUP_TABLE':
      return state.set('groupData', Immutable.fromJS(action.json)).set('isFetching', false)
    case 'GET_GROUP_OPTION':
      return state.set('teacher_option', Immutable.fromJS(action.teacher_option))
          .set('course_option', Immutable.fromJS(action.course_option))
    // case 'UPDATE_GROUP_TEACHER':
    //   return state.setIn(['groupData', action.index, 'teacher_group'], action.json)
    case 'UPDATE_GROUP_HOUR':
      if(action.label == 'guide'){
        return state.setIn(['contractData', action.index, 'guide_min'], action.num)
      }else{
        return state.setIn(['contractData', action.index, 'class_min'], action.num)
      }
    case 'GET_CONTRACT_TABLE':
      return state.set('contractData', Immutable.fromJS(action.json)).set('isFetching', false)
    case 'GET_CONSUME_LESSON':
      return state.set('consumeLesson', Immutable.fromJS(action.json))
            .set('total_time', action.total_time).set('isFetching', false)
    case 'SEARCH_STU_NAME':
      return state.set('search_stu_name', Immutable.fromJS(action.result))
    case 'GET_STU_GROUP':
      return state.set('stu_group_option', Immutable.fromJS(action.result))
    case 'GET_HISTORY_CONTRACT':
      return state.set('his_contract_list', Immutable.fromJS(action.json))
            .set('total_fee', action.total_fee)
    case 'GET_STUDENT_CODE':
      return state.set('code',action.code)
    default:
      return state
  }
}
