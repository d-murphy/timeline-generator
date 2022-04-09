import React from 'react';
import getTimeline from './Data';
import Event from './Event'; 
import Year from './Year'; 
import Banner from './Banner'

type TimelineProps = {
  id: number;
};

function Timeline(props: TimelineProps) {
  const timelineData = getTimeline(props.id);
  const groupByYear = manipTimelineData(timelineData.events);

  const [y, setY] = React.useState(window.scrollY);

  const handleScroll = () => {
      const position = window.pageYOffset;
      document.documentElement.style.setProperty('--scroll-height', `${position}px`);
      var body = document.body,
      html = document.documentElement;

      var height = Math.max( body.scrollHeight, body.offsetHeight, 
                      html.clientHeight, html.scrollHeight, html.offsetHeight );
      document.documentElement.style.setProperty('--page-height', `${height}px`);

      setY(position);
  };
  
  React.useEffect(() => {
      window.addEventListener('scroll', handleScroll, { passive: true });
  
      return () => {
          window.removeEventListener('scroll', handleScroll);
      };
  }, []);

  const events = Object.values(groupByYear).map((year: YearGroup) => {
    return <Year year={year.year} events={year.events}/>
  })
  return (
    <div className='big-bottom-padding'>
      <Banner title={timelineData.title} subtitle={timelineData.subtitle}/>
      <div className='year-timeline'></div>
      <div className='year-timeline-filled'></div>
      {events}
    </div>
  )
}

export default Timeline


type GroupByYear = {
  [index: number]: YearGroup;
}

type TimelineEvent = {
  text: string,
  date: Date,
  eventMarker?: string
}


type YearGroup = {
  year: number,
  events: TimelineEvent[]
}


function manipTimelineData(timelineData: TimelineEvent[]): GroupByYear {
  timelineData = timelineData.sort((a, b) => a.date < b.date ? -1 : 1)
  const groupByYear: GroupByYear = {};
  timelineData.forEach(el => {
    if (!groupByYear[el.date.getFullYear()]) {
      groupByYear[el.date.getFullYear()] = {
        year: el.date.getFullYear(),
        events: [el]
      }
    } else {
      groupByYear[el.date.getFullYear()].events.push(el)
    }
  })
  return groupByYear;
}