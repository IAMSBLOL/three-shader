import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { APP_TEST } from '../../router'
import { Modal } from 'zarm'
import './home.module.less'

const Home = (props: any): JSX.Element => {
  console.log(props)
  const [visible, setVisible] = useState(false)
  return (
    <div styleName='home'>
      <NavLink
        to={APP_TEST}
      >
        <span>Home</span>
      </NavLink>
      <div className='test1' onClick={() => { setVisible(true) }}>热更新似乎a不是111很好用asd啊</div>
      <Modal visible={visible} maskClosable onCancel={() => setVisible(false)} animationType='door' >
        <div>
          123
        </div>
      </Modal>
    </div>
  )
}

export default Home
