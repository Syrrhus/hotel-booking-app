import React from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
//displays the hotel card UI 
const HotelList = ({ hotels }) => {
  const htmlToPlainText = (html) => {
    var doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  return (
    <Grid container spacing={3}>
      {hotels.map((hotel, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card>
            <CardMedia
              component="img"
              height="200"
              image={`${hotel.image_details.prefix}${hotel.default_image_index}${hotel.image_details.suffix}`}
              alt={hotel.name}
            />
            <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <Typography variant="h6" component="div" gutterBottom>
                  {hotel.name}
                </Typography>
                <div style={{textAlign:"center"}}>
                <Box display="flex" alignItems="center" mb={1}>
                  {hotel.rating && (
                    <>
                      {[...Array(hotel.rating)].map((_, index) => (
                        <StarIcon key={index} style={{ color: '#fdd835' }} />
                      ))}
                      <Typography variant="body2" color="textSecondary">
                        ({hotel.rating})
                      </Typography>
                    </>
                  )}
                </Box>
                </div>
                <Typography variant="body2" color="textSecondary" component="p">
                  {hotel.address}
                </Typography>
              </div>
              <Typography variant="body2" color="textPrimary" component="p" sx={{ textAlign: 'justify' }}>
                {htmlToPlainText(hotel.description)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default HotelList;
