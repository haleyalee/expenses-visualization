import React from "react";

function SkeletonLoader() {
  return (
    <>
        <div className="dash skeleton">
            <div>
            <div id="pie-chart" className="widget skeleton-widget"></div>
            <div id="spending-summary" className="widget skeleton-widget"></div>
            </div>
            <div id="spending-details-table" className="widget skeleton-widget"></div>
        </div>
    </>
  );
};

export default SkeletonLoader;