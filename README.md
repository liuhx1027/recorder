```
ffmpeg -i 10_spektrum_a2-1.mp3 -af "silencedetect=noise=-18dB:d=0.6,ametadata=mode=print:file=vol.txt" -f null -
```

```
cat vol.txt | grep lavfi.silence_start | awk -F= '{print $2}' | xargs -I{} echo {},
```


`aws s3 sync ./meta-data s3://survey.liutaoran.com/meta-data --profile lhx`