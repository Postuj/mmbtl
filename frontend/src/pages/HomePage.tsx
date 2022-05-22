import React, { FC } from 'react'
import HomeLayout from '../layouts/DefaultLayout'
import QuickActions from '../components/home/QuickActions'
import GameHistory from '../components/game/GameHistory'

const HomePage: FC = () => {
  return (
    <HomeLayout>
      <QuickActions />
      <GameHistory />
    </HomeLayout>
  )
}

export default HomePage
