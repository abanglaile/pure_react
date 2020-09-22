import { UserAuthWrapper } from 'redux-auth-wrapper'
// import { routerActions,push } from 'react-router-redux';

export const requireAuthentication = UserAuthWrapper({
  authSelector: state => {
    // alert("state:"+JSON.stringify(state));
    return (state.managerData);
  },

  predicate: managerData => managerData.get('isAuthenticated'),

  failureRedirectPath: (state, ownProps) => {
    // console.log("ownProps:",ownProps);
    // console.log("ownProps.location.query.redirect :",ownProps.location.query.redirect);
    var url = ownProps.location.pathname + ownProps.location.search;
    return url;

  },
//   redirectAction: routerActions.push,
  redirectAction: (newLoc) => {  
    console.log("newLoc:"+JSON.stringify(newLoc)); 
    console.log("newLoc.query.redirect:",newLoc.query.redirect);
    window.location.href = "http://www.zhiqiu.pro/zhiqiu-login/pc_login?redirect=" + newLoc.query.redirect;
  },
//   redirectAction: routerActions.replace,
  wrapperDisplayName: 'UserIsJWTAuthenticated'
})
