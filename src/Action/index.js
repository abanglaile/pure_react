import axios from 'axios'
import { message } from 'antd';

let target = process.server_url

/*---------------------鉴权相关-------------------*/
export const loginUserSuccess = (token) => {
  localStorage.setItem('token', token);
  return {
    type: 'LOGIN_USER_SUCCESS',
    token: token,
  }
}
/*---------------------鉴权相关结束-------------------*/

//开始获取测试数据
const getDataStart = () => {
  return {
    type: 'GET_DATA_START',
  }
}

// Dispatch to Methods Defination
export const demoRequest = () => {
  let url = target + '/getCourse'
  return (dispatch) => {
    return axios.get(url).then((response) => {
      dispatch({
        type: 'GET_COURSE',
        course: response.data
      })
    })
  }
}

export const getTeacherList = (schoolId) => {
  let url = target + '/getTeacherList'
  return (dispatch) => {
    dispatch(getDataStart());
    return axios.get(url, { params: { schoolId } })
    .then((response) => {
      console.log("response.data:",JSON.stringify(response.data));
      dispatch({
        type: 'GET_TEACHER_LIST',
        json: response.data
      })
    })
  }
}

export const getGroupTable = (schoolId) => {
  let url = target + '/getGroupTable'
  return (dispatch) => {
    dispatch(getDataStart());
    return axios.get(url, { params: { schoolId } })
    .then((response) => {
      dispatch({
        type: 'GET_GROUP_TABLE',
        json: response.data
      })
    })
  }
}

export const getContractTable = (schoolId) => {
  let url = target + '/getContractTable'
  return (dispatch) => {
    dispatch(getDataStart());
    return axios.get(url, { params: { schoolId } })
    .then((response) => {
      dispatch({
        type: 'GET_CONTRACT_TABLE',
        json: response.data
      })
    })
  }
}

export const getCodeByStudentid = (student_id) => {
  let url = target + '/getCodeByUserid'
  return (dispatch) => {
    return axios.get(url, { params: { student_id } })
    .then((response) => {
      dispatch({
        type: 'GET_STUDENT_CODE',
        code: response.data
      })
    })
  }
}

export const getGroupOptionData = (schoolId) => {
  let url = target + '/getGroupOptionData'
  return (dispatch) => {
    return axios.get(url, { params: { schoolId } })
    .then((response) => {
      dispatch({
        type: 'GET_GROUP_OPTION',
        teacher_option: response.data.teacher_option,
        course_option: response.data.course_option,
      })
    })
  }
}

export const updateGroupTeacher = ( school_id, selected_teacher, group_id, index) => {
  let url = target + '/updateGroupTeacher'
  return (dispatch) => {
    return axios.post(url, { selected_teacher, group_id })
    .then((response) => {
      dispatch(getGroupTable(school_id));
    })
  }
}

export const changGroupSta = (school_id,group_id,group_state) => {
  let url = target + '/changGroupState'
  return (dispatch) => {
    return axios.post(url, { group_id, group_state })
    .then((response) => {
      dispatch(getGroupTable(school_id));
      // message.success('分组停用成功！');
    })
  }
}

export const updateGroupHour = (stu_group_id, student_id, num, index, label, school_id) => {
  let url = target + '/updateGroupHour'
  return (dispatch) => {
    return axios.post(url, { stu_group_id, student_id, num, label })
    .then((response) => {
      dispatch(getContractTable(school_id));
      // dispatch({
      //   type: 'UPDATE_GROUP_HOUR',
      //   index: index,
      //   num: num,
      //   label: label,
      // })
    })
  }
}

export const setSchoolId = (schoolId) => {
  console.log("action schoolId:",schoolId);
  return {
     type: 'UPDATE_SCHOOL_ID',
     schoolId,
 }
}

export const addNewGroup = (new_group, groupTeacher) => {
  let url = target + "/addNewSchoolGroup";
  return dispatch => {
      return axios.post(url, {new_group, groupTeacher})
      .then(function (response) {
          dispatch(getGroupTable(new_group.school_id));
      })
      .catch(function (error) {
          console.log(error);
      });
  }
}

export const getConsumeLesson = (stu_group_id, label, filter_option) => {
  let url = target + '/getConsumeLesson'
  return (dispatch) => {
    dispatch(getDataStart());
    return axios.post(url, { stu_group_id, label, filter_option })
    .then((response) => {
      console.log("response.data:",response.data);
      dispatch({
        type: 'GET_CONSUME_LESSON',
        json: response.data.lessonList,
        total_time: response.data.total_time,
      })
    })
  }
}

export const searchStuName = (input) => {
  let url = target + "/searchStuName";
  return dispatch => {
      return axios.get(url, {params: {input}})
      .then(function (response) {
          dispatch({
              type : 'SEARCH_STU_NAME',
              result: response.data, 
          });
      })
      .catch(function (error) {
          console.log(error);
      });
  }
}

export const getStuGroup = (userid,school_id) => {
  let url = target + "/getMyStuGroupData2";
  console.log("school_id:",school_id);
  return dispatch => {
      return axios.get(url, {params: {userid,school_id}})
      .then(function (response) {
          dispatch({
              type : 'GET_STU_GROUP',
              result: response.data, 
          });
      })
      .catch(function (error) {
          console.log(error);
      });
  }
}

export const addNewContract = (contract, school_id) => {
  let url = target + "/addNewContract";
  return dispatch => {
      return axios.post(url, {contract})
      .then(function (response) {
        message.success('合同新增成功！');
        dispatch(getContractTable(school_id));
      })
      .catch(function (error) {
          message.error('合同新增失败！');
          console.log(error);
      });
  }
}

export const getHistoryContract = (stu_group_id) => {
  let url = target + '/getHistoryContract'
  return (dispatch) => {
    return axios.get(url, {params: {stu_group_id}})
    .then((response) => {
      dispatch({
        type: 'GET_HISTORY_CONTRACT',
        json: response.data.hisContractList,
        total_fee: response.data.total_fee,
      })
    })
    .catch(function (error) {
        console.log(error);
    });
  }
}
