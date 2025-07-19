
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const ShimmerCard = ({ className = '' }) => {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="shimmer h-4 w-24 rounded"></div>
              <div className="shimmer h-8 w-40 rounded"></div>
            </div>
            <div className="shimmer h-12 w-12 rounded-xl"></div>
          </div>
          <div className="shimmer h-40 w-full rounded-lg"></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShimmerCard;
