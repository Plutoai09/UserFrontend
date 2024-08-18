import './Waitlist.css';

const Waitlist = () => {
  return (
    <div className="waitlist-container">
      <div className="waitlist-content">
        <h2>Are you a content creator or Domain Expert?</h2>
        <div className="waitlist-action">
          <span>Become an expert on Pluto</span>
          <button className="waitlist-button">Join the waitlist &rarr;</button>
        </div>
      </div>
    </div>
  );
}

export default Waitlist;
