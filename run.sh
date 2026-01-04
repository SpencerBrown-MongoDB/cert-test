
mongotls -erase
sed "s/--NODE--/m1/g; s/--PORT--/27017/g;" config.yaml > config1.yaml
mkdir -p data/m1
sed "s/--NODE--/m2/g; s/--PORT--/27018/g;" config.yaml > config2.yaml
mkdir -p data/m2
sed "s/--NODE--/m3/g; s/--PORT--/27019/g;" config.yaml > config3.yaml
mkdir -p data/m3
mongod --config config1.yaml 
mongod --config config2.yaml
mongod --config config3.yaml
