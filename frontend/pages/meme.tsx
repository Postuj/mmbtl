import React from 'react';
import Head from 'next/head';
import { NextPage } from 'next';
import MemeLayout from '../layouts/MemeLayout';
import RoundTitle from '../components/game/RoundTitle';
import TimeBar from '../components/game/TimeBar';
import MemeForm from '../components/memes/MemeForm';
import ReadyButton from '../components/game/ReadyButton';

type MemePageProps = {
  // meme: MemeType;
  // round: Round;
  isRating?: boolean;
};

const MemePage: NextPage<MemePageProps> = ({ isRating }) => {
  return (
    <>
      <Head>
        <title>MemeBattle - Meme</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MemeLayout>
        <RoundTitle
          primary={`Round ${1}${!isRating ? ' rating' : ''}`}
          secondary="house fire"
        />
        <TimeBar currentTime={30} maxTime={60} />
        <MemeForm isRating={!isRating} />
        <ReadyButton />
      </MemeLayout>
    </>
  );
};

export default MemePage;
