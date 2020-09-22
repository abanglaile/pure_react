import React from 'react'
import { Route, IndexRoute } from 'react-router'
import { requireAuthentication } from '../utils';

import App from '@/Component/app'
import teacherManager from '@/Component/teacherManager'
import groupManager from '@/Component/groupManager'
import studentManager from '@/Component/studentManager'
import roomManager from '@/Component/roomManager'
import contractManager from '@/Component/contractManager'

const routes = (
  <Route path="school-zq" component={App}>
  {/* <Route path="school-zq" component={requireAuthentication(App)}>  */}
    <IndexRoute component={teacherManager} />
    <Route path="teacher" component={teacherManager} />
    <Route path="group" component={groupManager} />
    <Route path="contract" component={contractManager} />
    <Route path="student" component={studentManager} />
    <Route path="room" component={roomManager} />
  </Route>
)

export default routes
