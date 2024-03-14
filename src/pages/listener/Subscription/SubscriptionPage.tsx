import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../../../components/BackButton';
import TabWrapper from '../../../components/TabWrapper.tsx';
import '../../../assets/scss/listener-subscriptions.scss';
import SubscribedPodcast from './SubscribedPodcast';
import SubscribedPodcaster from './SubscribedPodcaster';

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const { subscriptionsof } = useParams();
  const [activeTab, setActiveTab] = useState<string>(subscriptionsof || '');

  const onBack = () => {
    navigate(-1);
  };

  return (
    <div className='container listener-subscription-page'>
      <div>
        <BackButton text='Subscriptions' onClick={onBack} />
      </div>
      <div className='row'>
        <div className='col-lg-12'>
          <TabWrapper
            items={[
              {
                key: 'podcasts',
                title: 'Podcasts',
                children: <SubscribedPodcast isActive={activeTab === 'podcasts'} />,
              },
              {
                key: 'podcasters',
                title: 'Podcasters',
                children: <SubscribedPodcaster isActive={activeTab === 'podcasters'} />,
              },
            ]}
            onSelect={(value: string) => setActiveTab(value)}
            defaultActiveKey={subscriptionsof || ''}
            id='subscriptions'
          />
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
