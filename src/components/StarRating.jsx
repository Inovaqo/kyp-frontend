const StarRating = ({ rating }) => {
  const getStarClass = (value) => {
    if (rating >= value) {
      return 'filled';
    } else if ((value - rating)* 100 < 100 ) {
      return 'half';
    } else {
      return 'start-content';
    }
  };

  const getHalfStarWidth = (value) => {
    if ((value - rating)* 100 < 100 ) {
      return 95-((value - rating)* 100) +'%'
    }
    return 0
  };

  return (
    <div className="star-rating">
      <div className="stars">
        {[1, 2, 3, 4, 5].map((value) => (
            <div key={value} className="position-relative">
              <span
                  key={value}
                  className={`star z-2 ${getStarClass(value)}`}
                  style={
                    getStarClass(value) === 'half'
                        ? {'--half-width': getHalfStarWidth(value)}
                        : {}
                  }
              >
            &#9733;
          </span>
              <div className="position-absolute" style={{top:'0',zIndex:'1'}}>
                <span
                    key={value}
                    className={`star start-content`}
                >
                &#9733;
              </span>
              </div>

            </div>

        ))}
      </div>
    </div>
  );
};

export default StarRating;
