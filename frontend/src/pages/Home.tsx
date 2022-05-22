import React, { FC } from 'react'
import GameButton from '../components/home/GameButton'
import HomeLayout from '../layouts/HomeLayout'
import QuickActions from '../components/home/QuickActions'

const Home: FC = () => {
  return (
    <HomeLayout>
      <QuickActions />
    </HomeLayout>
  )
}

export default Home
