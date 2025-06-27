// Example for ExperienceSection.jsx
import { Card, CardContent, TextField, Button, IconButton, Grid } from '@mui/material';
import { Delete, AutoFixHigh } from '@mui/icons-material';

export default function ExperienceSection({ experience, onChange, onAdd, onRemove, onEnhance }) {
  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Experience</Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: 'right' }}>
            <Button variant="contained" onClick={onAdd}>Add Experience</Button>
          </Grid>
        </Grid>

        {experience.map((exp, index) => (
          <Card key={exp.id} sx={{ mt: 2, p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Job Title"
                  fullWidth
                  value={exp.title}
                  onChange={(e) => onChange(index, 'title', e.target.value)}
                />
              </Grid>
              {/* More fields... */}
              <Grid item xs={12} sx={{ textAlign: 'right' }}>
                <IconButton onClick={() => onEnhance(index)}>
                  <AutoFixHigh color="primary" />
                </IconButton>
                <IconButton onClick={() => onRemove(index)}>
                  <Delete color="error" />
                </IconButton>
              </Grid>
            </Grid>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}