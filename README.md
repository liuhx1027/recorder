```
ffmpeg -i 10_spektrum_a2-1.mp3 -af "silencedetect=noise=-18dB:d=0.6,ametadata=mode=print:file=vol.txt" -f null -                                  vwfs-du-druk-dev
```

```
cat vol.txt | grep lavfi.silence_ | awk -F= '{print $2}' | xargs -I{} echo {},
```
